import ArchivedComp from "@/components/ArchivedComp";
import FormsList from "@/components/FormsList";
import MainContainer from "@/components/MainContainer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { PlusIcon } from "@radix-ui/react-icons";
import TopBar from "@/components/TopBar";

export default function Home(context: any) {
  const tgWebAppStart = context.searchParams.tgWebAppStartParam;

  // console.log(tgWebAppStart)
  if (tgWebAppStart) {
    const form_link = "/forms/fill/" + tgWebAppStart;
    console.log(form_link);
    redirect(form_link);
  }

  return (
    <MainContainer>
      {/* <Button variant="default">Hello</Button> */}
      <TopBar />
      <div className="pb-9 pt-12">
        {/* <h1 className="text-3xl font-bold text-center">Telegram Forms</h1> */}
        {/* <Text tw="px-3" content="Welcome to telegram forms a place where we"/> */}
        <FormsList />
      </div>
      {/* <ArchivedComp /> */}
    </MainContainer>
  );
}
