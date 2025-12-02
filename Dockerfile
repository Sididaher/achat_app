# Dockerfile بسيط لمشروع Next.js (مع output: "standalone")

# -------- Stage 1: deps (تنزيل الـ dependencies) --------
FROM node:20-slim AS deps

WORKDIR /app

# ننسخ ملفات البكجات
COPY package.json package-lock.json ./

# تثبيت نظيف يعتمد على package-lock.json
RUN npm ci

# -------- Stage 2: builder (بناء Next.js) --------
FROM node:20-slim AS builder

WORKDIR /app

# ننسخ node_modules من مرحلة deps
COPY --from=deps /app/node_modules ./node_modules

# ننسخ باقي المشروع
COPY . .

# تعطيل Telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# تمرير متغيرات Supabase للـ build (مهم)
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY

ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY

# بناء التطبيق
RUN npm run build

# -------- Stage 3: runner (صورة التشغيل) --------
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# إنشاء مستخدم غير root
RUN useradd -m nextjs

# ننسخ فقط الملفات اللازمة للتشغيل
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# نعطي صلاحيات للمستخدم
RUN chown -R nextjs:nextjs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js يجي من output: "standalone"
CMD ["node", "server.js"]
