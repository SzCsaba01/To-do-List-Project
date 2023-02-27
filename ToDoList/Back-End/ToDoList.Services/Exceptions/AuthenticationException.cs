using System.Net;
using ToDoList.API.Infrastructure;

namespace ToDoList.Services.Business.Exceptions;

public class AuthenticationException : ApiExceptionBase
{
    public AuthenticationException() : base(HttpStatusCode.BadRequest, "Authentication failed")
    {
    }

    public AuthenticationException(string message) : base(HttpStatusCode.BadRequest, message, "Authentication failed")
    {
    }

    public AuthenticationException(string message, Exception innerException) : base(HttpStatusCode.BadRequest, message, innerException, "Authentication failed")
    {
    }
}
