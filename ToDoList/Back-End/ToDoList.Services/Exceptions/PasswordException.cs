﻿using System.Net;
using ToDoList.API.Infrastructure;

namespace ToDoList.Services.Business.Exceptions;
public class PasswordException :ApiExceptionBase {
    public PasswordException() : base(HttpStatusCode.Conflict, "Password error") { }

    public PasswordException(string message) : base(HttpStatusCode.Conflict, message, "Password error") {
    }

    public PasswordException(string message, Exception innerException) : base(HttpStatusCode.Conflict, message, innerException, "Password error") {
    }
}
