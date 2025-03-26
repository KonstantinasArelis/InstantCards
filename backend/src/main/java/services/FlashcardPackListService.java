package services;

import contracts.FlashcardListDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import mybatis.dao.FlashcardpackMapper;
import mybatis.model.Flashcardpack;
import org.apache.ibatis.session.SqlSession;

import java.util.List;

@ApplicationScoped
public class FlashcardPackListService {
    @Inject
    private SqlSession sqlSession;

    @Transactional
    public FlashcardListDto getFlashcardPackList(){
        FlashcardpackMapper mapper = sqlSession.getMapper(FlashcardpackMapper.class);
        List<Flashcardpack> packs = mapper.selectAll();
        FlashcardListDto dto = FlashcardListDto.fromMyBatis(packs);

        return dto;
    }
}
