﻿namespace ToDoList.Services.Contracts;
public interface ITokenService {
    public Task<string> GenerateRandomTokenAsync();
}
