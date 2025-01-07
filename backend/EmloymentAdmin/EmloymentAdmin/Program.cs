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

var builder = WebApplication.CreateBuilder(args);

// Thêm CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("http://localhost:3000", "http://ShopVibe.com") // Thay đổi URL theo yêu cầu
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});


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
builder.Services.AddIdentity<IdentityUser, IdentityRole>(option =>
    {
        option.Password.RequireDigit = false;
        option.Password.RequireLowercase = false;
        option.Password.RequireNonAlphanumeric = false;
        option.Password.RequireUppercase = false;
        option.Password.RequiredLength = 6;
        option.Password.RequiredUniqueChars = 1;
    }
    ).AddEntityFrameworkStores<AuthDbContext>().AddDefaultTokenProviders();

builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
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
            // Bạn có thể thực hiện thêm logic tại đây nếu cần
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
});

builder.Services.AddAuthorization(option =>
{
    option.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
    option.AddPolicy("UserPolicy", policy => policy.RequireRole("User"));
});


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