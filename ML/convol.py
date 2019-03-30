import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data
mnist = input_data.read_data_sets("/tmp/data", one_hot = True)

classes = 10
batch_size = 100
x = tf.placeholder('float', [None, 784])
y = tf.placeholder('float')
keep_prob = tf.placeholder(tf.float32)
def weight_variable(shape):
  initial = tf.truncated_normal(shape, stddev=0.1)
  return tf.Variable(initial)

def bias_variable(shape):
  initial = tf.constant(0.1, shape=shape)
  return tf.Variable(initial)
def conv2d(x, W):
  return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')
def max_pool_2x2(x):
  return tf.nn.max_pool(x, ksize=[1, 2, 2, 1],
                        strides=[1, 2, 2, 1], padding='SAME')

						
def neural_network_model(data):
	x_image = tf.reshape(data, [-1,28,28,1])
	hidden_1_layer = {'W_conv':weight_variable([5, 5, 1, 32]),
						'b_conv':bias_variable([32])}
						
	hidden_2_layer = {'W_conv':weight_variable([5, 5, 32, 64]),
						'b_conv':bias_variable([64])}
						
	hidden_3_layer = {'W_conv':weight_variable([3, 3, 64, 128]),
						'b_conv':bias_variable([128])}
	
	output_layer = {'weights':weight_variable([4 * 4 * 128, 1024]),
						'biases':bias_variable([1024])}

	output1_layer = {'weights':weight_variable([1024, 512]),
                                                'biases':bias_variable([512])}

	# 1st convolutional layer
	h_conv1 = tf.nn.relu(conv2d(x_image, hidden_1_layer['W_conv']) + hidden_1_layer['b_conv'])
	h_pool1 = max_pool_2x2(h_conv1)

	# 2nd convolutional layer
	h_conv2 = tf.nn.relu(conv2d(h_pool1, hidden_2_layer['W_conv']) + hidden_2_layer['b_conv'])
	h_pool2 = max_pool_2x2(h_conv2)

	# 3rd convolutional layer
	
	h_conv3 = tf.nn.relu(conv2d(h_pool2, hidden_3_layer['W_conv']) + hidden_3_layer['b_conv'])
	
	h_pool3 = max_pool_2x2(h_conv3)

	#dense layer
	h_pool3_flat = tf.reshape(h_pool3, [-1, 4*4*128])
	output = tf.nn.relu(tf.matmul(h_pool3_flat, output_layer['weights']) + output_layer['biases'])
	
	output1 = tf.nn.relu(tf.matmul(output, output1_layer['weights']) + output1_layer['biases'])

	out = tf.nn.dropout(output1, keep_prob)
	
	W_fc2 = weight_variable([512, 10])
	b_fc2 = bias_variable([10])
	y_conv = tf.matmul(out, W_fc2) + b_fc2
	return y_conv
	
def train_neural_network(x):
	prediction = neural_network_model(x)

	#cost functions: the mean of sum differences  
	cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(logits=prediction, labels=y))

	optimizer = tf.train.AdamOptimizer(1e-4).minimize(cost)

	hm_epochs = 100
	sess = tf.InteractiveSession()
	sess.run(tf.global_variables_initializer())
	
	for epoch in range(hm_epochs):
		epoch_loss = 0
		for _ in range(int(mnist.train.num_examples/batch_size)):
			epoch_x, epoch_y = mnist.train.next_batch(batch_size)
			_, c = sess.run([optimizer, cost], feed_dict = {x: epoch_x, y: epoch_y, keep_prob: 0.5})
			epoch_loss += c

		print('Epoch', epoch+1, 'completed out of', hm_epochs, '; Loss:', epoch_loss)
		if epoch_loss < 0.2:
			break		

	correct = tf.equal(tf.argmax(prediction, 1), tf.argmax(y, 1))
	accuracy = tf.reduce_mean(tf.cast(correct, 'float'))
	print('Test Accuracy:', accuracy.eval({x:mnist.test.images, y:mnist.test.labels, keep_prob: 1}))
	print('Validation Accuracy:', accuracy.eval({x:mnist.validation.images, y:mnist.validation.labels, keep_prob: 1}))
		

train_neural_network(x)
