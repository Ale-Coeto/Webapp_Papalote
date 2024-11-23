import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

//dataurl: base64
export const getTypeImageBase64 = (dataurl: string) => {
  const pattern = /data:image\/([a-zA-Z]+);base64/;

  const res = pattern.exec(dataurl);
  if (!res?.[1]) {
    return "";
  }
  return res[1];
};

export const uploadFile = async ({
  file, // base64
  bucket,
  path,
}: {
  file: string;
  bucket: string;
  path: string;
}) => {
  const base64 = await fetch(file);
  const blob = await base64.blob();

  await ensureBucketExists(bucket);

  return await supabase.storage.from(bucket).upload(path, blob, {
    upsert: true,
  });
};

export const ensureBucketExists = async (bucket: string) => {
  const { error } = await supabase.storage.getBucket(bucket);
  if (error) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: true,
    });
    if (createError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: createError.message,
      });
    }
  }
};

const getFileUrl = (base: string, path: string) => {
  return `${env.SUPABASE_URL}/storage/v1/object/${base}/${path}`;
};

// Upload the image to supabase if input isn't a url. Return the url of the image.
export const getImageLink = async (
  inputImage: string,
  bucket: string,
  file_name: string,
) => {
  if (inputImage.startsWith("data:image")) {
    const type = getTypeImageBase64(inputImage);

    const result = await uploadFile({
      bucket: bucket,
      file: inputImage,
      path: file_name + "." + type,
    });

    if (result.error) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: result.error.message,
      });
    } else {
      return getFileUrl(bucket, result.data.path);
    }
  } else {
    return inputImage;
  }
};
