'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function OpenApiDocsPage() {
  return <SwaggerUI url="/api/docs" displayOperationId={true} />;
}
