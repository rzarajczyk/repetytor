package com.repetytor.model

data class ApiResponse<T>(
    val status: Boolean,
    val data: T? = null
)

data class NavigationResponse(
    val status: Boolean,
    val navigation: List<LinkItem>
)
