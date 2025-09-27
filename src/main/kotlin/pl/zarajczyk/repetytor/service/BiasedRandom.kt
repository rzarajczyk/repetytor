package pl.zarajczyk.repetytor.service

import kotlin.random.Random

object BiasedRandom {
    
    fun random(): Double = Random.nextDouble()
    
    fun getBiasedRandomIndex(biases: List<Double>): Int {
        val rightRangeBordersExclusive = mutableListOf<Double>()
        var border = 0.0
        for (bias in biases) {
            border += bias
            rightRangeBordersExclusive.add(border)
        }
        
        val random = random() * border
        
        var index = 0
        while (random >= rightRangeBordersExclusive[index]) {
            index++
        }
        return index
    }
    
    fun <T> getMultipleBiasedRandomElements(array: List<T>, biases: List<Double>, count: Int): List<T> {
        if (array.size <= count) {
            return array.shuffled()
        }
        
        val result = mutableListOf<T>()
        val arrayCopy = array.toMutableList()
        val biasesCopy = biases.toMutableList()
        
        for (i in 0 until count) {
            val randomIndex = getBiasedRandomIndex(biasesCopy)
            val selectedElement = arrayCopy[randomIndex]
            result.add(selectedElement)
            arrayCopy.removeAt(randomIndex)
            biasesCopy.removeAt(randomIndex)
        }
        
        return result
    }
}
