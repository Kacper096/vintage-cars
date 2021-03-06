﻿using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VintageCars.Domain.Customer.Address.Commands;
using VintageCars.Domain.Customer.Address.Responses;
using VintageCars.Domain.Customer.Commands;
using VintageCars.Domain.Customer.Responses;

namespace VintageCars.Web.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AccountController : BaseController
    {
        public AccountController(IMediator mediator) : base(mediator)
        {
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] CreateAccountCommand account)
            => await ExecuteCommandWithoutResult(account);

        [HttpPost("login")]
        public async Task<ActionResult<LoginCustomerResponse>> Login([FromBody] LoginCustomerCommand account)
            => Result(await SendAsync(account));

        [HttpPost("recovery-password")]
        public async Task<ActionResult> RecoveryPassword([FromBody] RecoverPasswordCommand command)
            => await ExecuteCommandWithoutResult(command);

        [Authorize]
        [HttpPost("details")]
        public async Task<ActionResult> AddressAccountDetails([FromBody] CreateUpdateAddressCommand command)
            => await ExecuteCommandWithoutResult(command);

        [Authorize]
        [HttpGet("details")]
        public async Task<ActionResult<AddressDetailResponse>> GetAddressAccountDetails()
            => Result(await SendAsync(new GetAddressDetailQuery()), true);
    }
}