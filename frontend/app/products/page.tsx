import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Products - CyberPress Platform',
  description: 'Explore our products and services',
};

const products = [
  {
    id: 1,
    name: 'CyberPress CMS',
    description: 'A powerful headless CMS for modern web applications',
    price: '$99/month',
    features: ['Headless Architecture', 'API-First', 'Real-time Updates', 'Multi-language'],
    popular: true,
  },
  {
    id: 2,
    name: 'Analytics Suite',
    description: 'Comprehensive analytics and insights for your content',
    price: '$79/month',
    features: ['Real-time Analytics', 'Custom Dashboards', 'Export Reports', 'API Access'],
    popular: false,
  },
  {
    id: 3,
    name: 'Team Collaboration',
    description: 'Work together seamlessly with your team',
    price: '$49/month',
    features: ['Real-time Editing', 'Comments & Reviews', 'Version Control', 'Task Management'],
    popular: false,
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white py-20 dark:border-gray-800 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful tools to help you create, manage, and grow your digital presence
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card
                key={product.id}
                className="relative overflow-hidden transition-all hover:shadow-xl"
              >
                {product.popular && (
                  <div className="absolute right-0 top-0 rounded-bl-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                    Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{product.name}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-400">
                    {product.description}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {product.price}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="mb-6 space-y-3">
                    {product.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg
                          className="mr-2 h-5 w-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mb-8 text-xl text-gray-400">
            Join thousands of creators who trust CyberPress
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="primary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
