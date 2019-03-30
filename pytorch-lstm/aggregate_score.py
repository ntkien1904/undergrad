from __future__ import division
import numpy as np 
import os
import torch
import torch.nn as nn

cnn_file = 'score/ucf_rgb_1.npz'

lstm_rawfile = 'score/lstm_nosoftmax.npz'
lstm_file = 'score/lstm.npz'

svm_trainfile = 'score/svm_datatrain.npz'
svm_testfile = 'score/svm_datatest.npz'
#svm_testfile = 'score/svm_log_test.npz'

metadata_root = '../data/ucf101_splits/split_editted'
file_ = 'testlist01.txt'

label_size = 101

def softmax(raw_score, T=1):
    exp_s = np.exp((raw_score - raw_score.max(axis=-1)[..., None])*T)
    sum_s = exp_s.sum(axis=-1)
    return exp_s / sum_s[..., None]

def default_aggregation_func(score_arr, normalization=True, crop_agg=None):
    """
    This is the default function for make video-level prediction
    :param score_arr: a 3-dim array with (frame, crop, class) layout
    :return:
    """
    crop_agg = np.mean if crop_agg is None else crop_agg
    if normalization:
        return softmax(crop_agg(score_arr, axis=1).mean(axis=0))
    else:
        return crop_agg(score_arr, axis=1).mean(axis=0)

def Getlabel():
    file_path = os.path.join(metadata_root, file_)
    labels = []

    with open(file_path,'r')as fp:
        lines=fp.readlines()
        
        for line in lines:
            label_tmp=line.strip().split(' ')[1]
            labels.append(int(label_tmp))

    return labels

def GetConfidenceScore(labels, score_svm):
	
	best = np.argmax(score_svm,axis = 1)

	c_score = np.ones(label_size)
	
	for i in range(len(labels)):	
		if c_score[labels[i]] > score_svm[i][best[i]]:
			c_score[labels[i]] = score_svm[i][best[i]]

	return c_score




#correct = (video_pred == test_labels).sum()

#m = nn.Softmax(1)
#score_svmtest = m(torch.from_numpy(score_svmtest)).numpy()

#print score_svmtest
#print score_lstm.shape
#exit()


'''
weight_lstm = 1
weight_svm = 70

final = score_lstm * weight_lstm + score_vsm * weight_svm

predict = np.argmax(final, 1)

correct = 0
for i in range(len(labels)):
    if predict[i] == labels[i]:
        correct += 1

'''

#idea 1
'''
from svm select n best classes. use DL chooses best from them
best: svm + avg-cnn: 3266 / 3783: improve DL
fuse: 3303, 3340 
'''

def Idea1(score_svmtest, score_cnn, score_lstm, test_labels):
	n = 5

	#val = np.sort(score_svmtest, axis = 1)[:,-n:]
	top_n = score_svmtest.argsort(axis = 1)[:,-n:]

	correct = 0
	for i in range(len(test_labels)):
	    
	    #val = [score_cnn[i][x] for x in top_n[i]] 
	    #max_ = val.index(max(val))

	    #if top_n[i][max_] == test_labels[i]:
	    #    correct += 1

		for x in top_n[i]:
			score_svmtest[i][x] = 20 * score_svmtest[i][x] + score_cnn[i][x]
		predict = np.argmax(score_svmtest[i])
		print score_svmtest[i][predict]
		if predict == test_labels[i]:
			correct += 1

	print correct
	exit()

#idea 2
'''
svm: from training set confidence score for each class. (min score of each class)
if test input score < c_score, use DL to choose
no improve DL since c_score too high
'''
def Idea2(score_svmtest, score_cnn, score_lstm, score_svmtrain, train_labels, test_labels):
	
	c_score = GetConfidenceScore(train_labels, score_svmtrain)

	best_svm = np.argmax(score_svmtest,axis = 1)

	correct = 0
	count = 0
	count_svm_correct = 0 
	count_lstm_on_svm = 0
	count_lstm_correct = 0

	for i in range(len(test_labels)):

		if score_svmtest[i][best_svm[i]] >= c_score[best_svm[i]]:
			count += 1
			if best_svm[i] == test_labels[i]:
				correct += 1
				count_svm_correct += 1
		
			predict = np.argmax(score_lstm[i])
			if predict == test_labels[i]:
				count_lstm_on_svm += 1

		else:
			predict = np.argmax(score_lstm[i])
			if predict == test_labels[i]:
				correct += 1
				count_lstm_correct += 1

	
	print 'count', count
	print 'count_svm', count_svm_correct
	print 'count_lstm_on', count_lstm_on_svm

	print 'count_lstm', count_lstm_correct
	
	#print 'Accuracy' , correct, len(test_labels), correct/len(test_labels)

#idea 3
'''
if svm score between best and other < threshold, use DL or fuse
best:
'''
def Idea3(score_svmtest, score_cnn, score_lstm, test_labels):
	n = 5

	val = np.sort(score_svmtest, axis = 1)[:,-n:]
	#val = np.sort(score_lstm, axis = 1)[:,-n:]
	top_n = score_svmtest.argsort(axis = 1)[:,-n:]

	#print top_n
	#exit()

	correct = 0
	correct_lstm = 0
	correct_svm = 0

	part1 = 0
	part2 = 0

	for i in range(len(test_labels)):
	
		if val[i][n-1] - val[i][n-2] < 0.1: #and not labels[i] == top_n[i][n-1] :
			#print labels[i], top_n[i], val[i]
			#predict = np.argmax(score_lstm[i])
		
			final = score_cnn[i] + 30 * score_svmtest[i] #score_lstm[i] +   #+
		
			predict = np.argmax(final)
			if predict == test_labels[i]:
				correct += 1
				correct_lstm += 1
			#part1 += 1
		else:
			#predict = np.argmax(score_svmtest[i])
			final = score_svmtest[i] #+ score_lstm[i]
			predict = np.argmax(final)
			if predict == test_labels[i]:
				correct += 1
				correct_svm += 1
			part2 += 1
	print correct, correct_lstm, correct_svm
	#print part1 #, part2



if __name__ == "__main__":

	train_labels = np.load(svm_trainfile)['labels']
	train_labels = np.array(train_labels, dtype = np.int64)

	test_labels = np.load(svm_testfile)['labels']

	score_lstm = np.load(lstm_file)['scores']

	#score_lstm = np.load(lstm_rawfile)['scores']

	#percentage = np.sum(score_lstm, axis = 1)
	#print percentage

	#for i in range(len(score_lstm)):
	#	score_lstm[i] = score_lstm[i] / percentage[i]

	score_svmtrain = np.load(svm_trainfile)['scores']

	score_svmtest = np.load(svm_testfile)['scores']

	score_cnn = np.load(cnn_file)['scores'][:,0]

	score_pred = [default_aggregation_func(x) for x in score_cnn]
	score_cnn = np.array(score_pred)

	Idea1(score_svmtest, score_cnn, score_lstm, test_labels)
	Idea2(score_svmtest, score_cnn, score_lstm, score_svmtrain, train_labels, test_labels)
	Idea3(score_svmtest, score_cnn, score_lstm, test_labels)


