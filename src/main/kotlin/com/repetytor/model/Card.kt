package com.repetytor.model

data class Card(
    val id: String?,
    val question: String,
    val answer: String,
    val bias: Double,
    val timeout: Int,
    val type: String
)
