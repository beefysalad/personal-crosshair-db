import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetCrosshairs } from "@/app/shared/hooks/crosshair/useCrosshair";
import * as crosshairService from "@/app/shared/hooks/crosshair/crosshair-service";

// Mock the crosshair service
jest.mock("@/app/shared/hooks/crosshair/crosshair-service");

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetCrosshairs Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches crosshairs successfully", async () => {
    const mockData = {
      crosshairs: [
        {
          id: "1",
          name: "Test Crosshair",
          code: "0;P;c;5;h;0;f;0;0l;4;0o;2;0a;1;0f;0;1b;0",
          description: "Test description",
          imageUrl: "https://example.com/image.png",
          imagePublicId: "test-id",
          createdAt: new Date(),
        },
      ],
      total: 1,
    };

    jest.spyOn(crosshairService, "getCrosshairs").mockResolvedValue(mockData);

    const { result } = renderHook(() => useGetCrosshairs(1, 12), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check the data
    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.crosshairs).toHaveLength(1);
    expect(result.current.data?.total).toBe(1);
  });

  it("handles error state", async () => {
    const mockError = new Error("Failed to fetch crosshairs");
    jest.spyOn(crosshairService, "getCrosshairs").mockRejectedValue(mockError);

    const { result } = renderHook(() => useGetCrosshairs(1, 12), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeTruthy();
  });

  it("calls getCrosshairs with correct parameters", async () => {
    const getCrosshairsSpy = jest
      .spyOn(crosshairService, "getCrosshairs")
      .mockResolvedValue({
        crosshairs: [],
        total: 0,
      });

    renderHook(() => useGetCrosshairs(2, 24), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(getCrosshairsSpy).toHaveBeenCalledWith(2, 24));
  });
});
