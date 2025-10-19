import React, { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // ここに将来的にGraphQLクライアント、状態管理などのプロバイダーを追加
  return <>{children}</>;
};
