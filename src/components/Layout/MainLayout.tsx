import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: '系统概览', subtitle: '动物园饲养繁育管理平台' },
  '/animals': { title: '动物档案', subtitle: '管理所有动物的个体档案、谱系血缘和检疫隔离' },
  '/feeding': { title: '饲喂管理', subtitle: '饲料配方、饲喂计划与投喂记录管理' },
  '/health': { title: '健康监测', subtitle: '体检记录、诊疗跟踪与疫苗接种管理' },
  '/breeding': { title: '繁育记录', subtitle: '发情监测、配种登记与幼崽哺育管理' },
  '/enclosure': { title: '笼舍环境', subtitle: '温湿度监控、清洁记录与安全检查' },
  '/behavior': { title: '行为观察', subtitle: '行为丰容、刻板行为观察与日常记录' },
  '/education': { title: '科普展示', subtitle: '讲解排班、参观互动与动物科普信息' },
};

export default function MainLayout() {
  const location = useLocation();
  const pageInfo = pageTitles[location.pathname] || { title: '动物园管理系统', subtitle: '' };

  return (
    <div className="flex min-h-screen bg-cream-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={pageInfo.title} subtitle={pageInfo.subtitle} />
        <main className="flex-1 p-6 overflow-auto">
          <div className="animate-fade-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
