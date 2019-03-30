import torch.nn as nn
import torch.nn.functional as F
import torch

class LSTMClassifier(nn.Module):
    def __init__(self, input_dim, hidden_dim, sequence, label_size, batch_size, use_gpu):
        super(LSTMClassifier, self).__init__()

        self.hidden_dim = hidden_dim
        self.batch_size = batch_size
        self.use_gpu = use_gpu
        self.sequence = sequence
        
        self.lstm = nn.LSTM(input_dim, hidden_dim)
        self.drop = nn.Dropout(0.5)
        self.hidden2label = nn.Linear(hidden_dim, label_size)
        self.hidden = self.init_hidden()
    
    def init_hidden(self):
        if self.use_gpu:
            h0 = torch.zeros(1, self.batch_size, self.hidden_dim).cuda()
            c0 = torch.zeros(1, self.batch_size, self.hidden_dim).cuda()
        else:
            h0 = torch.zeros(1, self.batch_size, self.hidden_dim)
            c0 = torch.zeros(1, self.batch_size, self.hidden_dim)
        return (h0, c0)

    def forward(self, input):
        
        x = input.view(self.sequence, self.batch_size, -1)
        #print x.size
        lstm_out, self.hidden = self.lstm(input, self.hidden)
        dropout = self.drop(lstm_out)
        #mean = torch.mean(dropout, 0) # mean over sequence
        y = self.hidden2label(dropout[-1])
        return y
