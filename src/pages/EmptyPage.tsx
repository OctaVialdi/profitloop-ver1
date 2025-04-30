
const EmptyPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-3xl font-semibold mb-4">Empty Page</h1>
        <p className="text-gray-500">This is an empty page ready for your content.</p>
        <div className="mt-8">
          <a href="/" className="text-blue-500 hover:underline">Return to Home</a>
        </div>
      </div>
    </div>
  );
};

export default EmptyPage;
