import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { router } from './router'

describe('Cortex renderer', () => {
  it('renders the default workspace route', async () => {
    window.location.hash = '#/'
    await router.load()

    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    )

    expect(screen.getByText('Cortex', { selector: '.brand-name' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Product brief' })).toBeInTheDocument()
  })
})
