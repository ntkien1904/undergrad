import torch
import copy

import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.autograd import Variable
import model as Model
import data_process as DP
from torch.utils.data import DataLoader

import tables
import numpy as np

#parameters
epochs = 200
use_gpu = torch.cuda.is_available()
#use_gpu = False
learning_rate = 0.001

train_file = 'trainlist01.txt'
test_file = 'testlist01.txt'

def save_model(model, index):
    
    file_save = 'last_clip_epoch_' + str(index)
    torch.save(model, 'model/' + file_save + '.pt')

    return

if __name__=='__main__':

    #parameters
    input_dim = 1024
    output_dim = 101 #51 
    hidden_dim = 256
    sequence = 25
    batch_size = 24 #10

    #assume data here ...
   
    dtrain_set = DP.LoadData(train_file)
    train_loader = DataLoader(dtrain_set,
                              batch_size = batch_size,
                              shuffle = True)
                              #num_workers = 2)
    print len(train_loader)

    dtest_set = DP.LoadData(test_file)

    test_loader = DataLoader(dtest_set,
                          batch_size=batch_size,
                          shuffle=False)

    #model
    model = Model.LSTMClassifier(input_dim = input_dim, hidden_dim = hidden_dim, sequence = sequence, label_size = output_dim, batch_size = batch_size, use_gpu = use_gpu)
    #model = torch.load('model/last_bz24_epoch_10.pt')

    model.train()

    if use_gpu:
        model = model.cuda()

    optimizer = optim.SGD(model.parameters(), lr=learning_rate,momentum = 0.9)
    loss_function = nn.CrossEntropyLoss()
    train_loss_ = []
    train_acc_ = []

    best = None

    # training procedure
    for epoch in range(epochs):

        ## training epoch
        total_acc = 0.0
        total_loss = 0.0
        total = 0.0

        for iter,traindata in enumerate(train_loader):
            inputs, labels = traindata

            if use_gpu:
                inputs = inputs.cuda()
                labels = labels.cuda()

            model.zero_grad()
            model.batch_size = len(labels)
            model.hidden = model.init_hidden()
            
            output = model(inputs.t())
            #output = torch.mean(output,0)
        
            loss = loss_function(output, labels)
            loss.backward()
            torch.nn.utils.clip_grad_norm(model.parameters(), 5)
            optimizer.step()

            # calc training acc
            _, predicted = torch.max(output.data, 1)

            #print predicted
            total_acc += (predicted == labels).sum()
            total += len(labels)
            total_loss += loss.data[0]

        train_loss_.append(total_loss / total)
        #print total_acc.item(), total, total_acc.item()/total
        train_acc_.append(total_acc.item() / total)

        print('[Epoch: %3d/%3d] Training Loss: %.5f, Training Acc: %.5f'
              % (epoch, epochs, train_loss_[epoch], train_acc_[epoch]))

        if (epoch+1) % 20 == 0:
            save_model(model, (epoch+1)/20)
    
    #testing
    model.eval()

    total_acc = 0.0
    total = 0.0
    
    classes_acc = []
    class_hit = np.zeros(output_dim)
    class_count = np.zeros(output_dim)

    for iter,testdata in enumerate(test_loader):
        inputs, labels = testdata

        if use_gpu:
            inputs, labels = inputs.cuda(), labels.cuda()
        
        model.batch_size = len(labels)
        model.hidden = model.init_hidden()
        output = model(inputs.t())
        #output = torch.mean(output, 0)
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

    print 'total', total_acc, total
    print 'mAP' , class_acc.mean()
    


    print 'done'


