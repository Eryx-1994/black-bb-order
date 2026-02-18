<template>
	<div class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
		<h2 class="text-xl font-bold mb-4 text-gray-800">添加新商品</h2>

		<form @submit.prevent="handleSubmit" class="space-y-6">
			<!-- 图片上传 -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>商品图片 *</label
				>
				<div
					@dragover.prevent="handleDragOver"
					@drop.prevent="handleDrop"
					@dragleave="isDragging = false"
					:class="[
						'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200',
						isDragging
							? 'border-blue-500 bg-blue-50'
							: errors.image
								? 'border-red-500'
								: 'border-gray-300 hover:border-blue-400',
					]"
				>
					<input
						type="file"
						ref="fileInputRef"
						@change="handleFileChange"
						accept="image/*"
						class="hidden"
					/>

					<div
						v-if="!selectedImage"
						class="flex flex-col items-center justify-center py-8"
					>
						<UploadIcon :size="48" class="text-gray-400 mb-3" />
						<p class="text-sm text-gray-600">拖拽图片到此处或点击上传</p>
						<button
							type="button"
							@click="fileInputRef?.click()"
							class="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
						>
							选择图片
						</button>
					</div>

					<div v-else class="flex flex-col items-center">
						<img
							:src="previewUrl"
							alt="预览图片"
							class="w-32 h-32 object-cover rounded-lg mb-3 border"
						/>
						<p class="text-sm text-gray-600 truncate max-w-full">
							{{ selectedImage.name }}
						</p>
						<button
							type="button"
							@click="removeImage"
							class="mt-2 px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm transition-colors"
						>
							删除图片
						</button>
					</div>
				</div>

				<div
					v-if="errors.image"
					class="mt-1 text-sm text-red-600 flex items-center"
				>
					<AlertCircleIcon :size="16" class="mr-1" />
					{{ errors.image }}
				</div>
			</div>

			<!-- 商品名称 -->
			<div class="space-y-2">
				<label for="name" class="block text-sm font-medium text-gray-700 mb-1"
					>商品名称 *</label
				>
				<input
					id="name"
					v-model="formData.name"
					type="text"
					placeholder="请输入商品名称"
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
						errors.name ? 'border-red-500' : 'border-gray-300',
					]"
				/>
				<div
					v-if="errors.name"
					class="mt-1 text-sm text-red-600 flex items-center"
				>
					<AlertCircleIcon :size="16" class="mr-1" />
					{{ errors.name }}
				</div>
			</div>

			<!-- 价格 -->
			<div class="space-y-2">
				<label for="price" class="block text-sm font-medium text-gray-700 mb-1"
					>价格 *</label
				>
				<input
					id="price"
					v-model.number="formData.price"
					type="number"
					step="0.01"
					min="0"
					placeholder="请输入价格"
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
						errors.price ? 'border-red-500' : 'border-gray-300',
					]"
				/>
				<div
					v-if="errors.price"
					class="mt-1 text-sm text-red-600 flex items-center"
				>
					<AlertCircleIcon :size="16" class="mr-1" />
					{{ errors.price }}
				</div>
			</div>

			<!-- 类型 -->
			<div class="space-y-2">
				<label
					for="category"
					class="block text-sm font-medium text-gray-700 mb-1"
					>类型 *</label
				>
				<input
					id="category"
					v-model="formData.category"
					type="text"
					placeholder="请输入商品类型（如：咖啡、茶饮等）"
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
						errors.category ? 'border-red-500' : 'border-gray-300',
					]"
				/>
				<div
					v-if="errors.category"
					class="mt-1 text-sm text-red-600 flex items-center"
				>
					<AlertCircleIcon :size="16" class="mr-1" />
					{{ errors.category }}
				</div>
			</div>

			<!-- 是否为新品 -->
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700 mb-1"
					>是否为新品 *</label
				>
				<div class="flex items-center space-x-3">
					<label class="inline-flex items-center">
						<input
							type="radio"
							v-model="formData.isNew"
							:value="true"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500"
						/>
						<span class="ml-2 text-sm text-gray-700">是</span>
					</label>
					<label class="inline-flex items-center ml-4">
						<input
							type="radio"
							v-model="formData.isNew"
							:value="false"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500"
						/>
						<span class="ml-2 text-sm text-gray-700">否</span>
					</label>
				</div>
				<div
					v-if="errors.isNew"
					class="mt-1 text-sm text-red-600 flex items-center"
				>
					<AlertCircleIcon :size="16" class="mr-1" />
					{{ errors.isNew }}
				</div>
			</div>

			<!-- 备注 -->
			<div class="space-y-2">
				<label for="note" class="block text-sm font-medium text-gray-700 mb-1"
					>备注 *</label
				>
				<textarea
					id="note"
					v-model="formData.note"
					placeholder="请输入商品备注"
					rows="3"
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
						errors.note ? 'border-red-500' : 'border-gray-300',
					]"
				></textarea>
				<div
					v-if="errors.note"
					class="mt-1 text-sm text-red-600 flex items-center"
				>
					<AlertCircleIcon :size="16" class="mr-1" />
					{{ errors.note }}
				</div>
			</div>

			<div class="space-y-2">
				<label
					for="category"
					class="block text-sm font-medium text-gray-700 mb-1"
					>提交密码 *</label
				>
				<input
					id="category"
					v-model="keywords"
					type="text"
					placeholder="提交密码"
					:class="[
						'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors',
						errors.keywords ? 'border-red-500' : 'border-gray-300',
					]"
				/>
				<div
					v-if="errors.keywords"
					class="mt-1 text-sm text-red-600 flex items-center"
				>
					<AlertCircleIcon :size="16" class="mr-1" />
					{{ errors.keywords }}
				</div>
			</div>
			<!-- 提交按钮 -->
			<div class="pt-2">
				<button
					type="submit"
					:disabled="isSubmitting"
					class="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all duration-200 flex items-center justify-center"
				>
					<Loader2Icon
						v-if="isSubmitting"
						:size="20"
						class="animate-spin mr-2"
					/>
					<SaveIcon v-else :size="20" class="mr-2" />
					{{ isSubmitting ? "提交中..." : "提交" }}
				</button>
			</div>
		</form>

		<!-- 上传成功提示 -->
		<div
			v-if="message && messageType"
			class="mt-4 p-3 rounded-md text-center flex items-center justify-center"
			:class="{
				'bg-green-100 text-green-700': messageType === 'success',
				'bg-red-100 text-red-700': messageType === 'error',
			}"
		>
			<component
				:is="messageType === 'success' ? CheckIcon : AlertCircleIcon"
				:size="20"
				class="mr-2"
			/>
			{{ message }}
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, reactive } from "vue";
	import {
		UploadIcon,
		AlertCircleIcon,
		SaveIcon,
		Loader2Icon,
		CheckIcon,
	} from "lucide-vue-next";

	interface FormData {
		image: File | null;
		name: string;
		price: number | null;
		category: string;
		isNew: boolean | null;
		note: string;
	}

	interface ApiResponse {
		data: any;
		message: string;
		success: boolean;
	}

	const fileInputRef = ref<HTMLInputElement | null>(null);
	const selectedImage = ref<File | null>(null);
	const previewUrl = ref<string>("");
	const isDragging = ref(false);
	const isSubmitting = ref(false);
	const message = ref("");
	const messageType = ref<"success" | "error">(); // 'success' or 'error'

	// 表单数据
	const formData = reactive<FormData>({
		image: null,
		name: "",
		price: null,
		category: "",
		isNew: null,
		note: "",
	});
	const keywords = ref<string>("");

	// 错误信息
	const errors = reactive({
		image: "",
		name: "",
		price: "",
		category: "",
		isNew: "",
		note: "",
		keywords: "",
	});

	// 验证表单
	const validateForm = (): boolean => {
		let isValid = true;
		errors.image = "";
		errors.name = "";
		errors.price = "";
		errors.category = "";
		errors.isNew = "";
		errors.note = "";
		errors.keywords = "";
		if (keywords.value !== "971103") {
			errors.keywords = "请输入正确的提交密码";
		}

		if (!selectedImage.value) {
			errors.image = "请选择商品图片";
			isValid = false;
		}

		if (!formData.name.trim()) {
			errors.name = "请输入商品名称";
			isValid = false;
		}

		if (formData.price === null || formData.price < 0) {
			errors.price = "请输入有效价格";
			isValid = false;
		}

		if (!formData.category.trim()) {
			errors.category = "请输入商品类型";
			isValid = false;
		}

		if (formData.isNew === null) {
			errors.isNew = "请选择是否为新品";
			isValid = false;
		}

		if (!formData.note.trim()) {
			errors.note = "请输入商品备注";
			isValid = false;
		}

		return isValid;
	};

	// 处理文件选择
	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const file = target.files[0];
			if (file.type.startsWith("image/")) {
				setImage(file);
			} else {
				errors.image = "请选择有效的图片文件";
			}
		}
	};

	// 设置图片
	const setImage = (file: File) => {
		selectedImage.value = file;
		previewUrl.value = URL.createObjectURL(file);
		errors.image = "";
	};

	// 移除图片
	const removeImage = () => {
		selectedImage.value = null;
		previewUrl.value = "";
		if (fileInputRef.value) {
			fileInputRef.value.value = "";
		}
	};

	// 拖拽相关事件
	const handleDragOver = (event: DragEvent) => {
		event.preventDefault();
		isDragging.value = true;
	};

	const handleDrop = (event: DragEvent) => {
		event.preventDefault();
		isDragging.value = false;

		if (event.dataTransfer && event.dataTransfer.files.length > 0) {
			const file = event.dataTransfer.files[0];
			if (file.type.startsWith("image/")) {
				setImage(file);
			} else {
				errors.image = "请拖拽有效的图片文件";
			}
		}
	};

	// 提交表单
	const handleSubmit = async () => {
		if (!validateForm()) {
			return;
		}

		isSubmitting.value = true;
		message.value = ""; // 清空之前的消息

		try {
			// 创建 FormData 对象
			const formDataToSend = new FormData();
			if (selectedImage.value) {
				formDataToSend.append(
					"imgFile",
					selectedImage.value,
					selectedImage.value.name,
				);
			}
			formDataToSend.append("name", formData.name);
			formDataToSend.append("price", formData.price?.toString() || "");
			formDataToSend.append("category", formData.category);
			formDataToSend.append("isNew", formData.isNew ? "true" : "false"); // 将布尔值转换为字符串
			formDataToSend.append("note", formData.note);

			// 发送请求
			const response = await fetch(
				"http://114.67.69.198:8080/api/images/upload",
				{
					method: "POST",
					body: formDataToSend,
				},
			);

			// 解析响应数据
			const result: ApiResponse = await response.json();

			if (result.success) {
				// 成功提示
				message.value = result.message || "商品上传成功！";
				messageType.value = "success";

				// 清空表单
				resetForm();
			} else {
				// 失败提示
				message.value = result.message || "上传失败，请重试";
				messageType.value = "error";
			}
		} catch (error) {
			// 捕获异常并显示错误消息
			console.error("上传错误:", error);
			message.value =
				error instanceof Error ? error.message : "上传失败，请重试";
			messageType.value = "error";
		} finally {
			isSubmitting.value = false;
		}
	};

	// 重置表单
	const resetForm = () => {
		removeImage();
		formData.name = "";
		formData.price = null;
		formData.category = "";
		formData.isNew = null;
		formData.note = "";
		// 不清空消息，以便用户可以看到操作结果
	};
</script>
