import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const items = [
  {
    id: 'rte',
    request: 'Vet assistance for stray dog',
    supporter: 'Jane Supporter',
    initials: 'JS',
    date: 'Dec 4',
  },
  {
    id: 'rte1',
    request: 'Blankets for winter',
    supporter: 'John Doe',
    initials: 'JD',
    date: 'Dec 3',
  },
  {
    id: 'rte2',
    request: 'Food donations',
    initials: 'FD',
    supporter: 'Local Food Bank',
    date: 'Dec 2',
  },
  {
    id: 'rte3',
    request: 'Cat litter supplies',
    supporter: 'Alice Brown',
    initials: 'AB',
    date: 'Dec 4',
  },
  {
    id: 'rte4',
    request: 'Dog toys and treats',
    supporter: 'Michael Green',
    initials: 'MG',
    date: 'Dec 3',
  },
  {
    id: 'rte5',
    request: 'Heating support for shelter',
    supporter: 'Community Help Group',
    initials: 'CHG',
    date: 'Dec 2',
  },
];

export function RecentRequestsInProgress() {
  return (
    <div className="space-y-8">
      {items.map((item, i) => (
        <div className="flex items-center" key={i}>
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://robohash.org/${item.id}.png?set=set4&size=150x150`}
              alt="Avatar"
            />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <a
              href="#"
              className="text-sm font-medium leading-none hover:underline"
            >
              {item.request}
            </a>
            <p className="text-sm text-muted-foreground">{item.supporter}</p>
          </div>
          <div className="ml-auto text-sm">{item.date}</div>
        </div>
      ))}
    </div>
  );
}
