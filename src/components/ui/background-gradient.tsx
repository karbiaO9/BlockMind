export function BackgroundGradient() {
  return (
    <div 
      className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(200,200,255,0.05)'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
    </div>
  );
} 