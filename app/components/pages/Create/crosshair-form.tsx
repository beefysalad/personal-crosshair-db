import {
  useCreateCrosshair,
  useUploadCrosshair,
} from "@/app/shared/hooks/crosshair/useCrosshair";
import {
  createCrosshairSchemaForm,
  TCreateCrosshairSchemaForm,
} from "@/app/shared/zod schema/crosshair";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CrosshairForm = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { mutateAsync: uploadCrosshair, isPending } = useUploadCrosshair();
  const createCrosshairMutation = useCreateCrosshair();
  const form = useForm<TCreateCrosshairSchemaForm>({
    resolver: zodResolver(createCrosshairSchemaForm),
    defaultValues: {
      code: "",
      description: "",
      name: "",
      imageUrl: "",
      imagePublicId: "",
    },
  });
  const onSubmit = async (values: TCreateCrosshairSchemaForm) => {
    createCrosshairMutation.mutateAsync(values);
    form.reset();
    setImagePreview(null);
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      form.setError("imageUrl", {
        type: "manual",
        message: "File is too large. Maximum size is 5MB.",
      });
      setImagePreview(null);
      return;
    } else {
      
      form.clearErrors("imageUrl");
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);

    try {
      const response = await uploadCrosshair(formData);
      const uploadedUrl = response.url;
      const publicId = response.publicId
      form.setValue("imagePublicId", publicId);
      form.setValue("imageUrl", uploadedUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2'>
          <label
            className='block text-sm font-medium text-foreground'
            htmlFor='name'
          >
            Crosshair Name <span className='text-destructive'>*</span>
          </label>
          <Input
            id='name'
            {...form.register("name")}
            placeholder='Saladu Dot'
            className={`bg-background border ${
              form.formState.errors.name
                ? "border-destructive"
                : "border-border/50"
            } focus:border-accent`}
          />
          {form.formState.errors.name && (
            <span className='text-destructive text-xs mt-1'>
              {form.formState.errors.name.message}
            </span>
          )}
        </div>

        <div className='space-y-2'>
          <label className='block text-sm font-medium text-foreground'>
            Crosshair Code <span className='text-destructive'>*</span>
          </label>
          <Input
            id='code'
            {...form.register("code")}
            placeholder='Paste your crosshair code here'
            className={`bg-background border ${
              form.formState.errors.code
                ? "border-destructive"
                : "border-border/50"
            } focus:border-accent`}
          />
          {form.formState.errors.code && (
            <span className='text-destructive text-xs ml-2'>
              {form.formState.errors.code.message}
            </span>
          )}
        </div>
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-foreground'>
          Description
        </label>
        <Textarea
          id='description'
          {...form.register("description")}
          placeholder='Add notes about this crosshair... (optional)'
          className={`bg-background border resize-none min-h-24 ${
            form.formState.errors.description
              ? "border-destructive"
              : "border-border/50"
          } focus:border-accent`}
        />
      </div>

      <div className='space-y-2'>
        <label className='block text-sm font-medium text-foreground'>
          Crosshair Image <span className='text-destructive'>*</span>
        </label>
        {form.formState.errors.imageUrl && (
          <span className='text-destructive text-xs ml-2'>
            {form.formState.errors.imageUrl.message}
          </span>
        )}
        <div className='relative'>
          <Input
            id='image-upload'
            type='file'
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className='hidden'
          />
          <label
            htmlFor='image-upload'
            className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors bg-card/30 ${
              form.formState.errors.imageUrl
                ? "border-destructive"
                : "border-border/50 hover:border-accent/50"
            }`}
          >
            {imagePreview ? (
              <div className='flex flex-col items-center'>
                {isPending ? (
                  <div className='flex flex-col items-center justify-center h-40'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-accent'></div>
                    <p className='mt-2 text-sm text-muted-foreground'>
                      Uploading image...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt='Preview'
                      className='w-full h-48 rounded object-contain'
                    />
                    <p className='mt-2 text-sm text-muted-foreground'>
                      Click to change image
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className='text-center'>
                <div className='text-3xl mb-2'>📸</div>
                <p className='text-sm font-medium text-foreground'>
                  Upload crosshair image
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      <Button
        type='submit'
        disabled={createCrosshairMutation.isPending || isPending}
        className='w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-11'
      >
        {createCrosshairMutation.isPending ? "Creating..." : "Create Crosshair"}
      </Button>
    </form>
  );
};

export default CrosshairForm;
