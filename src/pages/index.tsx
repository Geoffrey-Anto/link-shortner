import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { type FormEventHandler, useEffect, useState, MouseEvent } from "react";
import { toast, Toaster } from "react-hot-toast";
import Button from "../UI/Button";
import Input from "../UI/Input";
import { trpc } from "../utils/trpc";
import ClipBoardSvg from "../UI/ClipBoardSvg";

// interface MutationError {
//   code: string;
//   minimum: number;
//   type: string;
//   inclusive: boolean;
//   message: string;
//   path: string[];
//   validation: string;
// }

const Home: NextPage = () => {
  const [data, setData] = useState({
    slug: "",
    url: "",
  });

  const [recentSlug, setRecentSlug] = useState("");

  // const [slug, setSlug] = useState("");

  const { mutateAsync } = trpc.link["create-link"].useMutation();

  // get query params

  const {
    query: { error },
    // replace,
  } = useRouter();

  const onSubmitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const res = await mutateAsync({
        ref: data.url,
        slug: data.slug,
      });
      if (res.data) {
        toast.success(res.message);
        setRecentSlug(data.slug);
        setData({
          slug: "",
          url: "",
        });
      }
    } catch (e_) {
      toast.error("Please Enter Valid Url Or Slug");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/${
        recentSlug.length > 0
          ? recentSlug
          : data.slug.length > 0
          ? data.slug
          : "[slug]"
      }`
    );
    toast.success("Copied to clipboard");
  };

  useEffect(() => {
    if (error) {
      toast.error(error as string);
    }
  }, [error]);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <main className="flex min-h-screen flex-col items-center justify-evenly bg-gradient-to-b from-[#2e026d] to-[#15162c] caret-rose-800">
        <h1 className="mb-10 text-4xl font-semibold text-white">
          Link Shortener
        </h1>
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col items-center gap-10"
        >
          <Input
            placeholder="Slug"
            onChange={(e) => {
              setData((d) => ({
                slug: e.target.value,
                url: d.url,
              }));
            }}
            value={data.slug}
            max={12}
            min={6}
          />
          <Input
            placeholder="Url"
            onChange={(e) => {
              setData((d) => ({
                url: e.target.value,
                slug: d.slug,
              }));
            }}
            value={data.url}
          />

          <Button placeholder="Submit" type="submit" />
        </form>
        {/* <div className="mt-14 flex gap-x-4">
          <Input
            placeholder="Enter Slug To Visit"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Button
            placeholder="Visit"
            onSubmit={async () => {
              await fetch(`http://localhost:3000/api/${slug}`);
            }}
            type="button"
          />
        </div> */}
        <div className="text-center text-xs text-white">
          To Visit Use{" "}
          <a
            href={`${process.env.NEXT_PUBLIC_SITE_URL}/api/${
              data.slug.length === 0 ? " [Slug] " : data.slug
            }`}
          >
            <span className="text-rose-400">
              {`${process.env.NEXT_PUBLIC_SITE_URL}/api/${
                data.slug.length === 0 ? " [Slug] " : data.slug
              }`}
            </span>
          </a>
          <div onClick={copyToClipboard} className="mt-2 cursor-pointer">
            Copy Recent To Clipboard <ClipBoardSvg />
          </div>
        </div>
        <p className="absolute bottom-4 text-white">
          Made By Geoffrey{" | "}
          <a href="https://github.com/Geoffrey-Anto/link-shortner">
            {"Github"}
          </a>
        </p>
      </main>
    </>
  );
};

export default Home;
