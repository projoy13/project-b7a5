

export const api = async (
  path: string,
  options: RequestInit = {}
) => {
  try {
    const res = await fetch(`${process.env.API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);

      return {
        success: false,
        message: errorData?.message || "Something went wrong",
      };
    }

    const data = await res.json();

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Server error",
    };
  }
};