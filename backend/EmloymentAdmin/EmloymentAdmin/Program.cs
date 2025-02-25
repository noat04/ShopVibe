using EmloymentAdmin.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using EmloymentAdmin.Middleware;
using EmploymentAdmin.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Routing;
using EmploymentAdmin.Models.Mapping;
using EmploymentAdmin.Service.VNPay;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.AspNetCore.Authentication;
using Microsoft.CodeAnalysis.Options;
using EmploymentAdmin.Models.Entities;
using EmploymentAdmin.Reponsitory;
using EmploymentAdmin.Service.Auth;

var builder = WebApplication.CreateBuilder(args);

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://ShopVibe.com", "https://localhost:7180") // Thay đổi URL theo yêu cầu
                   .AllowAnyHeader()
                   .AllowAnyMethod()
                   .AllowCredentials(); // Cho phép gửi thông tin xác thực;
        });
});
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin", policy =>
//    {
//        policy.WithOrigins("http://localhost:3000")
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials();
//    });
//});


// Thêm các d?ch v? vào container.
builder.Services.AddAutoMapper(typeof(ProductMapping));
builder.Services.AddAutoMapper(typeof(CartMapping));
builder.Services.AddControllers();
// Tìm hi?u thêm v? c?u hình Swagger/OpenAPI t?i https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AuthDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddIdentity<AspUserModel, IdentityRole>(option =>
    {
        option.Password.RequireDigit = false;
        option.Password.RequireLowercase = false;
        option.Password.RequireNonAlphanumeric = false;
        option.Password.RequireUppercase = false;
        option.Password.RequiredLength = 6;
        option.Password.RequiredUniqueChars = 1;
    }
    ).AddEntityFrameworkStores<AuthDbContext>().AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    //options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    //options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    //options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

    // Thiết lập scheme mặc định cho xác thực là Cookie
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            context.NoResult();
            context.Response.StatusCode = 401;
            context.Response.ContentType = "text/plain";
            return context.Response.WriteAsync("Token is invalid.");
        },
        OnTokenValidated = context =>
        {

            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            context.HandleResponse();
            context.Response.StatusCode = 401;
            context.Response.ContentType = "application/json";
            return context.Response.WriteAsync("{\"error\": \"Unauthorized access\"}");
        }
    };
}).AddCookie()
.AddGoogle(options =>
{
    options.ClientId = builder.Configuration["GoogleKeys:ClientId"];
    options.ClientSecret = builder.Configuration["GoogleKeys:ClientSecret"];
    options.CallbackPath = "/signin-google";  // Trùng với URI đã đăng ký trong Google Developer Console
});

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"))
    .AddPolicy("UserPolicy", policy => policy.RequireRole("User"));

builder.Services.AddSingleton<IVnPayService, VnPayService>();
builder.Services.AddScoped<IAuthService,AuthService>();

//builder.Services.AddTransient<EmploymentAdmin.Reponsitory.IEmailSender, EmailSender>();

builder.Services.AddTransient<IEmailSender, EmailSender>();

builder.Services.AddSingleton<MongoDBService>();

//Cấu hình kết nối với SQL Server
builder.Services.AddDbContext<ApplicationDBConText>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();


// C?u hình pipeline yêu c?u HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
    
app.UseHttpsRedirection();

// Sử dụng CORS
app.UseCors("AllowSpecificOrigins");

app.UseAuthentication(); // Thêm dòng này ?? kích ho?t middleware xác th?c
app.UseAuthorization();

app.MapControllers();
//app.UseMiddleware<SimpleMiddleware>();

app.Run();