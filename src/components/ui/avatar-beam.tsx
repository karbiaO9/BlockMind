"use client";

interface AvatarBeamProps {
  name: string;
  className?: string;
}

export function AvatarBeam({ name, className }: AvatarBeamProps) {
  // Create a consistent seed from the name
  const seed = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  
  const avatarUrl = `https://api.dicebear.com/7.x/beam/svg?seed=${seed}&backgroundColor=b6e3f4`;

  return (
    <img 
      src={avatarUrl} 
      alt={name}
      className={className}
    />
  );
} 