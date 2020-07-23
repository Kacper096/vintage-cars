﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Nop.Core.Infrastructure;

namespace VintageCars.Web.Configuration
{
    public partial class InitializeStartup : INopStartup
    {
        public void ConfigureServices(IServiceCollection services, IConfiguration configuration)
            => services.ConfigureSecurity(configuration)
                .AddControllers()
                .RegisterValidators();

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();

            app.UseRouting()
                .UseAuthentication()
                .UseAuthorization()
                .UseCors(builder => builder
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                )
                .UseHttpsRedirection()
                .UseEndpoints(endpoints => endpoints.MapControllers());
        }


        public int Order => 1;
    }
}