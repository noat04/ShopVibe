using AutoMapper;
using EmloymentAdmin.Models.Dtos;
using EmloymentAdmin.Models.Entities;

namespace EmploymentAdmin.Models.Mapping
{
    public class CustomerMapping : Profile
    {
        public CustomerMapping() {
            CreateMap<Customer, AddCustomerDto>();
        }

    }
};
