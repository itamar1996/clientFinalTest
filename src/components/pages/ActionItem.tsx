import React from 'react';

interface ActionItemProps {
  actionName: string;
  actionStatus: string;
}

export default function ActionItem({ actionName, actionStatus }: ActionItemProps) {
  return (
    <tr>
      <td>{actionName}</td>
      <td>{actionStatus}</td>
    </tr>
  );
}
