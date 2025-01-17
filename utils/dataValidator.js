
const validateRequest = async (request) => {
    try {
        console.log("Request in validateCreateRequest: " + request);
        const isQueryParamsPresent = request.query !== undefined && Object.keys(request.query).length > 0;
        const isBodyEmpty = request.headers['content-length'] === '0';
        const isNotApplicationJsonContent = request.headers['content-type'] !== "application/json";
        console.log("isQueryParamsPresent: " + (isQueryParamsPresent));
        console.log("isBodyEmpty: " + (isBodyEmpty));
        console.log("isNotApplicationJsonContent: " + (isNotApplicationJsonContent));
        if(isQueryParamsPresent) {
            return { validationFailed: true, failureMessage: "Invalid Request - contains query parameters." };
        }
        
        if (isBodyEmpty) {
            return { validationFailed: true, failureMessage: "Invalid Request - empty request body." };
        }

        if (isNotApplicationJsonContent) {
            return { validationFailed: true, failureMessage: "Invalid Request - content type is not application/json." };
        }
        
        const {first_name, last_name, password, email, ...extra} = request.body; 
        if (!first_name || !last_name || !password || !email) {
            return { validationFailed: true, failureMessage: "Invalid Request - empty request data (name, email, password)." };
        }
        if (Object.keys(extra).length > 0) {
            return { validationFailed: true, failureMessage: "Invalid Request - contains unwanted data." };
        }
  
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
        if(!emailRegex.test(email)) {
            return { validationFailed: true, failureMessage: "Invalid Request - invalid email format." };
        }

        if(typeof first_name !== 'string' || typeof last_name !== 'string' || typeof password !== 'string') {
            return { validationFailed: true, failureMessage: "Invalid Request - invalid datatypes." };
        }

        return { validationFailed: false, failureMessage: "NA" };
    } catch (error) {
        console.log("Error In validateCreateRequest: " + error);
        return { validationFailed: true, failureMessage: error };
    }

};

const validateGetRequest = async (request) => {
    try {
        const contentLength = request.headers['content-length'];
        const isContentLengthGrtThanZero = contentLength !== undefined && contentLength !== '0';
        const isQueryParamsPresent = Object.keys(request.query).length > 0;
        const isBodyPresent =  request.body && Object.keys(request.body).length > 0;
        console.log("Request Body: " + request.body);
        console.log("isQueryParamsPresent: " + isQueryParamsPresent);
        console.log("isBodyPresent: " + isBodyPresent);
        console.log("isContentLengthGrtThanZero: " + isContentLengthGrtThanZero);
        if(isQueryParamsPresent) {
            return { validationFailed: true, failureMessage: "Invalid Request - contains query parameters." };
        }
        
        if (isContentLengthGrtThanZero || isBodyPresent) {
            return { validationFailed: true, failureMessage: "Invalid Request - request body present." };
        }
        return { validationFailed: false, failureMessage: "NA" };
    } catch (error) {
        console.log("Error In validateGetRequest: " + error);
        return { validationFailed: true, failureMessage: error };
    }
   
};

const validateRequestMethod = async (request, expectedMethod) => {
    return request.method !== expectedMethod;
}

const validateSaveUserImageRequest = async (request) => {
    try {
        const contentLength = request.headers['content-length'];
        const contentType = request.headers['content-type'];
        const isBodyEmpty = contentLength !== undefined && contentLength === '0';
        const isQueryParamsPresent = Object.keys(request.query).length > 0;
        const isInvalidContentType = contentType !== undefined && !contentType.includes("multipart/form-data");
        //console.log("Request Body: " + request.body);
        console.log("isQueryParamsPresent: " + isQueryParamsPresent);
        console.log("isBodyEmpty: " + isBodyEmpty);
        console.log("contentType: " + request.headers['content-type']);
        console.log("isInvalidContentType: " + isInvalidContentType);
        
        if(isQueryParamsPresent) {
            return { validationFailed: true, failureMessage: "Invalid Request - contains query parameters." };
        }
        
        if (isBodyEmpty) {
            return { validationFailed: true, failureMessage: "Invalid Request - request body empty." };
        }

        if (isInvalidContentType) {
            return { validationFailed: true, failureMessage: "Invalid Request - invalid content type." };
        }

        if (!request.file) {
            return { validationFailed: true, failureMessage: "Invalid Request - no image found." };
        }
        if (!request.file || !request.file.mimetype || !request.file.mimetype.includes("image/")) {
            return { validationFailed: true, failureMessage: "Invalid Request - Invalid format." };
        }
        return { validationFailed: false, failureMessage: "NA" };
    } catch (error) {
        console.log("Error In validateSaveUserImageRequest: " + error);
        return { validationFailed: true, failureMessage: error };
    }
   
};


module.exports = {
    validateRequest,
    validateGetRequest,
    validateRequestMethod,
    validateSaveUserImageRequest
}