﻿using System.Net;

namespace ToDoList.API.Infrastructure;

public class ModelNotFoundException : ApiExceptionBase
{
    public ModelNotFoundException() : base(HttpStatusCode.NotFound, "Model Not Found")
    {
    }

    public ModelNotFoundException(string message) : base(HttpStatusCode.NotFound, message, "Model Not Found")
    {
    }

    public ModelNotFoundException(string message, Exception innerException) : base(HttpStatusCode.NotFound, message, innerException, "Model Not Found")
    {
    }
}
