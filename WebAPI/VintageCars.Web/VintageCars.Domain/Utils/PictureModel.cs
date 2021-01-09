﻿using Nop.Core.Domain.Media;

namespace VintageCars.Domain.Utils
{
    public class PictureModel
    {
        public Picture Picture { get; set; }
        public string DataAsBase64 { get; set; }
        public byte[] DataAsByteArray { get; set; }
    }
}
