import numpy as np

class neuron:
	name: int = 0

	def __init__(self):
		self.name: int = neuron.name
		neuron.name += 1
		self.weights: list[float] = []
		self.bias: float = np.rand()

	def __str__(self):
		return f"Neuron(name={self.name}, bias={self.bias}, weights={self.weights})"

	def __repr__(self):
		return f"Neuron(name={self.name}, bias={self.bias}, weights={self.weights})"
	
	def forward(self, input_values: list[float]) -> float :
		if len(input_values) != len(self.weights):
			raise ValueError("Input values must match the number of weights.")
		
		result: float = 0.0
		
		# Calculate the weighted sum of inputs
		for i in range(len(input_values)):
			result += input_values[i] * self.weights[i]
		# Add the bias once
		result += self.bias

		# Forward pass through the neuron
		value = self.activate(result)
		return value
	
	def activate(self, input_value: float) -> float :
		value = max(0, input_value) # ReLU activation
		return value


class layer:
	name: int = 0
	def __init__(self, nb_neurons: int = 5):
		self.name: int = layer.name
		layer.name += 1
		self.nb_neurons: int = nb_neurons
		self.neurons: list[neuron]

		for _ in range(self.nb_neurons):
			self.neurons.append(neuron())
	
	def forward(self, input_values: list[float]) -> list[float]:
		results: list[float] = []
		for n in range(len(self.neurons)):
			results[n] = self.neurons[n].forward(input_values)
		return results

	def __repr__(self):
		return f"Layer(name={self.name}, neurons={len(self.neurons)})"
	
class network:
	def __init__(self, nb_layers: int = 3, nb_neurons_per_layer: int = 5):
		self.nb_layers: int = nb_layers
		self.nb_neurons_per_layer: int = nb_neurons_per_layer
		self.layers: list[layer]
		self.output_layer: layer
		
		for _ in range(self.nb_layers):
			self.layers.append(layer(self.nb_neurons_per_layer))
		self.output_layer = layer(4)

	def work(self, inputs: list[float]):
		results: list[float] = []
		for layer in self.layers:
			results = layer.forward(inputs)
		
	def __repr__(self):
		return f"Network(layers={self.nb_layers})"
	

if __name__ == '__main__':
	print(np.random.rand())