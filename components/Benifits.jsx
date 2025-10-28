const Benifits = () => {

    return (
        <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-teal-100 bg-teal-50 p-5">
              <div className="text-2xl">🔒</div>
              <h3 className="mt-2 font-semibold text-gray-900">Private by design</h3>
              <p className="mt-1 text-sm text-gray-600">Runs in your browser where possible. Your files stay with you.</p>
            </div>
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
              <div className="text-2xl">⚡️</div>
              <h3 className="mt-2 font-semibold text-gray-900">Fast and reliable</h3>
              <p className="mt-1 text-sm text-gray-600">Snappy tools for everyday PDF tasks with clean, simple workflows.</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
              <div className="text-2xl">💸</div>
              <h3 className="mt-2 font-semibold text-gray-900">Free to use</h3>
              <p className="mt-1 text-sm text-gray-600">Use the most common tools at no cost. No watermark added!</p>
            </div>
          </div>
        </div>
      </section>
    )
}

export default Benifits