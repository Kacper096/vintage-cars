﻿using System;
using System.Collections.Generic;
using System.Text;
using Nop.Core.Caching;

namespace Nop.Service.Localization
{
    /// <summary>
    /// Represents default values related to localization services
    /// </summary>
    public static partial class NopLocalizationDefaults
    {
        /// <summary>
        /// Gets a key pattern to clear cache
        /// </summary>
        public static string LocaleStringResourcesPrefixCacheKey => "Nop.lsr.";

        /// <summary>
        /// Gets a key for caching
        /// </summary>
        /// <remarks>
        /// {0} : language ID
        /// </remarks>
        public static string LocaleStringResourcesByResourceNamePrefixCacheKey => "Nop.lsr.{0}";

        /// <summary>
        /// Gets a key for caching
        /// </summary>
        /// <remarks>
        /// {0} : language ID
        /// </remarks>
        public static CacheKey LocaleStringResourcesAllCacheKey => new CacheKey("Nop.lsr.all-{0}", LocaleStringResourcesPrefixCacheKey);

        /// <summary>
        /// Gets a key for caching
        /// </summary>
        /// <remarks>
        /// {0} : language ID
        /// </remarks>
        public static CacheKey LocaleStringResourcesAllPublicCacheKey => new CacheKey("Nop.lsr.all.public-{0}", LocaleStringResourcesPrefixCacheKey);

        /// <summary>
        /// Gets a key for caching
        /// </summary>
        /// <remarks>
        /// {0} : language ID
        /// {1} : resource key
        /// </remarks>
        public static CacheKey LocaleStringResourcesByResourceNameCacheKey => new CacheKey("Nop.lsr.{0}-{1}", LocaleStringResourcesByResourceNamePrefixCacheKey, LocaleStringResourcesPrefixCacheKey);

        #region Localized Properties

        /// <summary>
        /// Gets a key for caching
        /// </summary>
        public static CacheKey LocalizedPropertyAllCacheKey => new CacheKey("Nop.localizedproperty.all");

        /// <summary>
        /// Gets a key for caching
        /// </summary>
        /// <remarks>
        /// {0} : language ID
        /// {1} : entity ID
        /// {2} : locale key group
        /// {3} : locale key
        /// </remarks>
        public static CacheKey LocalizedPropertyCacheKey => new CacheKey("Nop.localizedproperty.value-{0}-{1}-{2}-{3}");

        #endregion

    }
}
