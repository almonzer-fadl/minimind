import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: Error | string;
  onRetry?: () => void;
  onRefresh?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  error,
  onRetry,
  onRefresh
}: ErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message;

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {errorMessage && (
          <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
            <strong>Error:</strong> {errorMessage}
          </div>
        )}
        <div className="flex gap-2 justify-center">
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          )}
          {onRetry && (
            <Button onClick={onRetry}>
              Try Again
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
