// WeaponItem.tsx
import React from 'react';

interface WeaponItemProps {
  weaponName: string;
  amount: number;
}

export default function WeaponItem({ weaponName, amount }: WeaponItemProps) {
  return (
    <tr>
      <td>{weaponName}</td>
      <td>{amount}</td>
    </tr>
  );
}
