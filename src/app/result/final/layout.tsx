import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = searchParams.username ? decodeURIComponent(searchParams.username as string) : '누군가';

  // 기본 메타데이터
  const defaultTitle = `${username}님이 최대 살 수 있는 아파트 가격이에요`;
  const defaultDescription = '내 연봉으로 살 수 있는 아파트 가격을 계산해 보세요!';

  return {
    title: defaultTitle,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      // 여기에 결과 페이지용 대표 이미지를 추가할 수 있습니다.
      // images: ['/result-og-image.png'],
    },
  };
}

export default function FinalResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 