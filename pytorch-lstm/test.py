from __future__ import division
import torch
import copy
import argparse
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.autograd import Variable
import model as Model
import data_process as DP
from torch.utils.data import DataLoader

import tables
import numpy as np

test_file = 'testlist01.txt'

use_gpu = torch.cuda.is_available()
batch_size = 30
label_size = 101

#file_name = 'lr0001_epoch_5.pt'

'''
def test():

    #read data

    f = h5py.File(Train_Dir + Files, 'r')
    
    dtest = f.keys()

    model = torch.load('model/' + file_name)

     if use_gpu:
        model = model.cuda()
    
    model.eval()
    total_acc = 0.0
    total = 0.0
    
    classes_acc = []
    class_hit = np.zeros(label_size)
    class_count = np.zeros(label_size)

    for i in range(len(dtest):

        label = f[dtest[i]]].attrs['label'] 
        roi_list = f[dtest[i]].keys()

        inputs = []

        for j in range(len(roi_list)):
            
            roi = np.asarray(f[dtest[i] + '/' + roi_list[j]])
            roi = torch.from_numpy(roi)
            inputs.append(roi)
        
        if use_gpu:
            inputs = inputs.cuda()
        
        model.batch_size = len(inputs)
        model.hidden = model.init_hidden()
        output = model(inputs.t())

        output = torch.mean(output, 0)
        output = torch.mean(output, 0)

        _, predicted = torch.max(output.data)

        class_count[label] += 1
        if predicted == label:
            class_hit[predicted += 1

    class_acc = np.divide(class_hit, class_count)
    #print classes_acc
    print 'mAP' , class_acc.mean()
'''

if __name__=='__main__':

    parser = argparse.ArgumentParser()
    parser.add_argument('--model',type=str)
    args=parser.parse_args()
    file_name = args.model

    dtest_set = DP.LoadData(test_file)
    test_loader = DataLoader(dtest_set,
                              batch_size = batch_size,
                              shuffle = False)
                              #num_workers = 4)
    #print len(dtest_set)

    
    print file_name
    model = torch.load(file_name)
    #loss_function = nn.CrossEntropyLoss()
    
    test_acc_ = []

    
    if use_gpu:
        model = model.cuda()
    
    model.eval()
    total_acc = 0.0
    total = 0.0
    
    classes_acc = []
    class_hit = np.zeros(label_size)
    class_count = np.zeros(label_size)

    score = torch.zeros(0,0)

    for iter,testdata in enumerate(test_loader):
        inputs, labels = testdata

        if use_gpu:
            inputs, labels = inputs.cuda(), labels.cuda()
        

        model.batch_size = len(labels)
        model.hidden = model.init_hidden()
        output = model(inputs.t())
        #output_sub = torch.stack((output[10],output[15],output[-1])) 
        #output = torch.mean(output_sub, 0)

        m = nn.Softmax(1)
        output1 = output.to(torch.device('cpu'))
        output2 = m(output1)
	
        score = torch.cat((score, output2), 0)

        _, predicted = torch.max(output.data, 1)

        hit = (predicted == labels).sum()
        #classes_acc.append(class_hit.item() / batch_size)

        total_acc += hit
        total += len(labels)

        for label in labels:
            class_count[label] += 1

        for i in range(len(labels)):
            if predicted[i] == labels[i]:
                class_hit[predicted[i]] += 1
    
    class_acc = np.divide(class_hit, class_count)

    #for i in range(len(class_acc)):
    #    print i, class_acc[i]
    
    #print 'total', total_acc, total

    #print classes_acc
    print 'mAP' , class_acc.mean()

    #print score.shape
    np.savez('lstm_nosoftmax', scores=score.detach().numpy())

    #for i in range(label_size):
    #    print '%d, %3f' % (i, class_acc[i])
 
    #test_acc_.append(total_acc.item() / total)

    #print('Testing Acc: %.3f'
    #          % (test_acc_[0]))
