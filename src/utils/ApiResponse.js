class ApiResponse {
    constructor(statusCode , data , message="success"){
        this.statusCode=statusCode,
        this.data=datathis.message=message,
        this.success = statusCode <400
    }
}

export {ApiResponse}