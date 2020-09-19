﻿using System;
using System.Collections.Generic;
using System.Linq;
using Nop.Data;
using Nop.Service.Caching.Extensions;

namespace Nop.Service.Store
{
    /// <summary>
    /// Store service
    /// </summary>
    public partial class StoreService : IStoreService
    {
        #region Fields

        //private readonly IEventPublisher _eventPublisher;
        private readonly IRepository<Core.Domain.Stores.Store> _storeRepository;

        #endregion

        #region Ctor

        public StoreService(IRepository<Core.Domain.Stores.Store> storeRepository)
        {
            //_eventPublisher = eventPublisher;
            _storeRepository = storeRepository;
        }

        #endregion

        #region Methods

        /// <summary>
        /// Deletes a store
        /// </summary>
        /// <param name="store">Store</param>
        public virtual void DeleteStore(Core.Domain.Stores.Store store)
        {
            if (store == null)
                throw new ArgumentNullException(nameof(store));

            var allStores = GetAllStores();
            if (allStores.Count == 1)
                throw new Exception("You cannot delete the only configured store");

            _storeRepository.Delete(store);

            //event notification
            //_eventPublisher.EntityDeleted(store);
        }

        /// <summary>
        /// Gets all stores
        /// </summary>
        /// <returns>Stores</returns>
        public virtual IList<Core.Domain.Stores.Store> GetAllStores()
        {
            var query = from s in _storeRepository.Table orderby s.DisplayOrder, s.Id select s;

            //we can not use ICacheKeyService because it'll cause circular references.
            //that's why we use the default cache time
            var result = query.ToCachedList(NopStoreDefaults.StoresAllCacheKey);

            return result;
        }

        /// <summary>
        /// Gets a store 
        /// </summary>
        /// <param name="storeId">Store identifier</param>
        /// <returns>Store</returns>
        public virtual Core.Domain.Stores.Store GetStoreById(Guid storeId)
        {
            if (storeId == Guid.Empty)
                return null;

            var store = _storeRepository.ToCachedGetById(storeId);

            return store;
        }

        /// <summary>
        /// Inserts a store
        /// </summary>
        /// <param name="store">Store</param>
        public virtual void InsertStore(Core.Domain.Stores.Store store)
        {
            if (store == null)
                throw new ArgumentNullException(nameof(store));

            _storeRepository.Insert(store);

            //event notification
            //_eventPublisher.EntityInserted(store);
        }

        /// <summary>
        /// Updates the store
        /// </summary>
        /// <param name="store">Store</param>
        public virtual void UpdateStore(Core.Domain.Stores.Store store)
        {
            if (store == null)
                throw new ArgumentNullException(nameof(store));

            _storeRepository.Update(store);

            //event notification
            //_eventPublisher.EntityUpdated(store);
        }

        /// <summary>
        /// Parse comma-separated Hosts
        /// </summary>
        /// <param name="store">Store</param>
        /// <returns>Comma-separated hosts</returns>
        public virtual string[] ParseHostValues(Core.Domain.Stores.Store store)
        {
            if (store == null)
                throw new ArgumentNullException(nameof(store));

            var parsedValues = new List<string>();
            if (string.IsNullOrEmpty(store.Hosts))
                return parsedValues.ToArray();

            var hosts = store.Hosts.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var host in hosts)
            {
                var tmp = host.Trim();
                if (!string.IsNullOrEmpty(tmp))
                    parsedValues.Add(tmp);
            }

            return parsedValues.ToArray();
        }

        /// <summary>
        /// Indicates whether a store contains a specified host
        /// </summary>
        /// <param name="store">Store</param>
        /// <param name="host">Host</param>
        /// <returns>true - contains, false - no</returns>
        public virtual bool ContainsHostValue(Core.Domain.Stores.Store store, string host)
        {
            if (store == null)
                throw new ArgumentNullException(nameof(store));

            if (string.IsNullOrEmpty(host))
                return false;

            var contains = ParseHostValues(store).Any(x => x.Equals(host, StringComparison.InvariantCultureIgnoreCase));

            return contains;
        }

        /// <summary>
        /// Returns a list of names of not existing stores
        /// </summary>
        /// <param name="storeIdsNames">The names and/or IDs of the store to check</param>
        /// <returns>List of names and/or IDs not existing stores</returns>
        public string[] GetNotExistingStores(string[] storeIdsNames)
        {
            if (storeIdsNames == null)
                throw new ArgumentNullException(nameof(storeIdsNames));

            var query = _storeRepository.Table;
            var queryFilter = storeIdsNames.Distinct().ToArray();
            //filtering by name
            var filter = query.Select(store => store.Name).Where(store => queryFilter.Contains(store)).ToList();
            queryFilter = queryFilter.Except(filter).ToArray();

            //if some names not found
            if (!queryFilter.Any())
                return queryFilter.ToArray();

            //filtering by IDs
            filter = query.Select(store => store.Id.ToString()).Where(store => queryFilter.Contains(store)).ToList();
            queryFilter = queryFilter.Except(filter).ToArray();

            return queryFilter.ToArray();
        }

        #endregion
    }
}
