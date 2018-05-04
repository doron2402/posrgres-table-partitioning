# Function & Trigger

- create a trigger function to dispatch the data among child tables.
```sql
create or replace function on_logs_insert() returns trigger as $$
begin
    if ( new.created_at >= date '2014-01-01' and new.created_at < date '2015-01-01') then
        insert into logs_2014 values (new.*);
    elsif ( new.created_at >= date '2015-01-01' and new.created_at < date '2016-01-01') then
        insert into logs_2015 values (new.*);
    else
        raise exception 'created_at date out of range';
    end if;

    return null;
end;
$$ language plpgsql;
```
- attaching the trigger function defined above to logs table.
```sql
create trigger logs_insert
    before insert on logs
    for each row execute procedure on_logs_insert();
```