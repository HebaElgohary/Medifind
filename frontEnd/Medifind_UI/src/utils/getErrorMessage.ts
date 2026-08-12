export const getErrorMessage = async (response: { json: () => any; status: any; }) => {
  try {
    const data = await response.json();

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }
  } catch {
    // response isn't JSON
  }

  switch (response.status) {
    case 400:
      return "Please check your registration information.";

    case 409:
      return "This email is already registered.";

    case 429:
      return "Too many registration attempts. Please try again later.";

    case 500:
      return "Server error. Please try again later.";

    default:
      return `Registration failed (${response.status}).`;
  }
};