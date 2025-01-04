using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace EmloymentAdmin.Middleware
{
    public class SimpleMiddleware
    {
        private readonly RequestDelegate _next;

        public SimpleMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Logic trước khi gọi middleware tiếp theo
            if (!context.Response.HasStarted)
            {
                context.Response.StatusCode = 200; // Đặt StatusCode nếu phản hồi chưa bắt đầu
            }

            await _next(context);

        
        }
    }
}