import os
import torch
from torch.utils.data.dataset import Dataset
import tables
import numpy as np

metadata_root = os.path.join('../data/ucf101_splits/split_editted')
feature_root = os.path.join('data/ucf101/feature_rgb_pool/')

class LoadData(Dataset):

    def __init__(self,file_):
        
        '''
        file_path = os.path.join(metadata_root, file_)
        self.files=[]
        self.labels=[]
        with open(file_path,'r')as fp:
            lines=fp.readlines()
            
            for line in lines:
                tmp_prefix=line.strip().split(' ')[0].split('/')[1]
                label_tmp=line.strip().split(' ')[1]
                self.files.append(os.path.join(feature_root,tmp_prefix+'.npy'))
                self.labels.append(int(label_tmp))
        '''
       

        class_ind = [x.strip().split() for x in open('data/ucf101_splits/classInd.txt')]
        class_mapping = {x[1]:int(x[0])-1 for x in class_ind}

        def line2rec(line):
            items = line.strip().split('/')
            label = class_mapping[items[0]]
            vid = items[1].split('.')[0]
            return vid, label
  
        filelist = [line2rec(x) for x in open('data/ucf101_splits/' + file_ )]
        files = np.array(filelist)
        self.files = files[:,0]
        self.labels = np.array(files[:,1], dtype = np.int64)



    def __len__(self):
        return len(self.labels)
    
    def __getitem__(self, index):
        
        data_numpy = np.load(feature_root + self.files[index] + '.npy')
        data = torch.from_numpy(data_numpy)

        label_numpy = np.asarray(self.labels[index], dtype = np.int64)
        label = torch.from_numpy(label_numpy)

        return data, label
