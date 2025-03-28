interface TableHeaderProps {
    columns: string[];
    colSpan?: number;
  }
  
  export function TableHeader({ columns, colSpan }: TableHeaderProps) {
    return (
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th 
              key={index}
              colSpan={colSpan}
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
    );
  }