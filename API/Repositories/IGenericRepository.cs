
using System.Linq.Expressions;

namespace API.Repositories;

public interface IGenericRepository<T> where T : class
{
    Task<IReadOnlyList<T>> GetAllAsync();
    Task<T?> GetAsync(Expression<Func<T, bool>> predicate);
    void Add(T entity);

    void Update(T entity);

    void Delete(T entity);

    Task<bool> SaveChangesAsync();

}
