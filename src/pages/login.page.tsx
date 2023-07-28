import { useLocation, useNavigate } from "react-router-dom";
import GitHubLogo from "../assets/github.svg";
import GoogleLogo from "../assets/google.svg";
import { getGitHubUrl } from "../utils/getGithubUrl";
import { getGoogleUrl } from "../utils/getGoogleUrl";
import { object, string, TypeOf } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "../store";
import { toast } from "react-toastify";
import { useEffect } from "react";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();
  const from = ((location.state as any)?.from.pathname as string) || "/profile";

  const loginUser = async (data: LoginInput) => {
    try {
      store.setRequestLoading(true);
      const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
      const response = await fetch(`${VITE_SERVER_ENDPOINT}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw await response.json();
      }

      store.setRequestLoading(false);
      navigate("/profile");
    } catch (error: any) {
      store.setRequestLoading(false);
      if (error.error) {
        error.error.forEach((err: any) => {
          toast.error(err.message, {
            position: "top-right",
          });
        });
        return;
      }
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values);
  };

  return (
    <section className="min-h-screen pt-20 bg-ct-blue-600">
      <div className="container flex items-center justify-center h-full px-6 py-12 mx-auto">
        <div className="px-8 py-10 bg-white md:w-8/12 lg:w-5/12">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="mb-6">
              <input
                type="email"
                className="block w-full px-4 py-5 m-0 text-sm font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded form-control bg-clip-padding focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-700">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                className="block w-full px-4 py-5 m-0 text-sm font-normal text-gray-700 transition ease-in-out bg-white border border-gray-300 border-solid rounded form-control bg-clip-padding focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
                {...register("password")}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-700">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="float-left w-4 h-4 mt-1 mr-2 align-top transition duration-200 bg-white bg-center bg-no-repeat bg-contain border border-gray-300 rounded-sm appearance-none cursor-pointer form-check-input checked:bg-blue-600 checked:border-blue-600 focus:outline-none"
                  id="exampleCheck3"
                />
                <label
                  className="inline-block text-gray-800 form-check-label"
                  htmlFor="exampleCheck2"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#!"
                className="text-blue-600 transition duration-200 ease-in-out hover:text-blue-700 focus:text-blue-700 active:text-blue-800"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="inline-block w-full py-4 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out bg-blue-600 rounded shadow-md px-7 hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Sign in
            </button>

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="mx-4 mb-0 font-semibold text-center">OR</p>
            </div>

            <a
              className="flex items-center justify-center w-full py-2 mb-3 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md px-7 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
              style={{ backgroundColor: "#3b5998" }}
              href={getGoogleUrl(from)}
              role="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              <img
                className="pr-2"
                src={GoogleLogo}
                alt=""
                style={{ height: "2rem" }}
              />
              Continue with Google
            </a>
            <a
              className="flex items-center justify-center w-full py-2 text-sm font-medium leading-snug text-white uppercase transition duration-150 ease-in-out rounded shadow-md px-7 hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
              style={{ backgroundColor: "#55acee" }}
              href={getGitHubUrl(from)}
              role="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              <img
                className="pr-2"
                src={GitHubLogo}
                alt=""
                style={{ height: "2.2rem" }}
              />
              Continue with GitHub
            </a>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
