﻿using System;
using Nop.Core;

namespace VintageCars.Data.Models.Base
{
    public abstract class BaseCreationEntity : BaseEntity
    {
        protected BaseCreationEntity()
        : base()
        {
            CreateDate = DateTime.UtcNow;
        }
        public Guid CreatedBy { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
