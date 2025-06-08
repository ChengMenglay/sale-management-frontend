import ErrorPage from "./error";

export default function NotFound() {
  return (
    <ErrorPage
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      errorCode="404"
      showRetry={false}
    />
  );
}
